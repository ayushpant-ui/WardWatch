<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Municipality;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class NepalAdministrativeSeeder extends Seeder
{
    public function run(): void
    {
        $dataset = $this->loadDataset();

        DB::transaction(function () use ($dataset) {
            // Maps dataset province IDs (1..7) to your exact migration ENUM values:
            // ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim']
            $provinceMeta = [
                1 => ['name' => 'Koshi',         'code' => 'P1', 'capital' => 'Biratnagar'],
                2 => ['name' => 'Madhesh',       'code' => 'P2', 'capital' => 'Janakpur'],
                3 => ['name' => 'Bagmati',       'code' => 'P3', 'capital' => 'Hetauda'],
                4 => ['name' => 'Gandaki',       'code' => 'P4', 'capital' => 'Pokhara'],
                5 => ['name' => 'Lumbini',       'code' => 'P5', 'capital' => 'Deukhuri'],
                6 => ['name' => 'Karnali',       'code' => 'P6', 'capital' => 'Birendranagar'],
                7 => ['name' => 'Sudurpashchim', 'code' => 'P7', 'capital' => 'Godawari'],
            ];

            $npProvinces = collect($dataset['provinces_np'])->keyBy('id');
            $npDistricts = collect($dataset['districts_np'])->keyBy('id');
            $npMunis     = collect($dataset['municipalities_np'])->keyBy('id');

            // 1. Seed `provinces`
            // Columns: name (enum), name_np, code, capital, is_active
            $provinceIdMap = [];
            foreach ($dataset['provinces_en'] as $p) {
                $srcId = (int) $p['id'];
                $meta  = $provinceMeta[$srcId];

                $province = Province::updateOrCreate(
                    ['name' => $meta['name']],
                    [
                        'name_np'   => $npProvinces[$srcId]['name'] ?? null,
                        'code'      => $meta['code'],
                        'capital'   => $meta['capital'],
                        'is_active' => true,
                    ]
                );

                $provinceIdMap[$srcId] = $province->id;
            }

            // 2. Seed `districts`
            // Columns: province_id, name, name_np, code, is_active
            $districtIdMap = [];
            foreach ($dataset['districts_en'] as $d) {
                $srcDistrictId = (int) $d['id'];
                $srcProvinceId = (int) $d['province_id'];

                $district = District::updateOrCreate(
                    [
                        'province_id' => $provinceIdMap[$srcProvinceId],
                        'name'        => trim($d['name']),
                    ],
                    [
                        'name_np'   => $npDistricts[$srcDistrictId]['name'] ?? null,
                        'code'      => 'D' . str_pad((string) $srcDistrictId, 2, '0', STR_PAD_LEFT),
                        'is_active' => true,
                    ]
                );

                $districtIdMap[$srcDistrictId] = $district->id;
            }

            // 3. Seed `municipalities` & `wards`
            // Municipality columns: district_id, name, name_np, type (enum), is_active
            // Ward columns: municipality_id, ward_number, name, office_location, is_active
            $now = now();
            foreach ($dataset['municipalities_en'] as $m) {
                $srcMuniId     = (int) $m['id'];
                $srcDistrictId = (int) $m['district_id'];
                $rawName       = trim($m['name']);

                // Map category_id / name to your exact migration ENUM:
                // ['metropolitan', 'sub_metropolitan', 'municipality', 'rural_municipality']
                $type = match ((int) ($m['category_id'] ?? 0)) {
                    1       => 'metropolitan',
                    2       => 'sub_metropolitan',
                    3       => 'municipality',
                    4       => 'rural_municipality',
                    default => match (true) {
                        str_contains(strtolower($rawName), 'sub-metropolitan') => 'sub_metropolitan',
                        str_contains(strtolower($rawName), 'metropolitan')     => 'metropolitan',
                        str_contains(strtolower($rawName), 'rural')            => 'rural_municipality',
                        default                                                => 'municipality',
                    },
                };

                $municipality = Municipality::updateOrCreate(
                    [
                        'district_id' => $districtIdMap[$srcDistrictId],
                        'name'        => $rawName,
                    ],
                    [
                        'name_np'   => $npMunis[$srcMuniId]['name'] ?? null,
                        'type'      => $type,
                        'is_active' => true,
                    ]
                );

                // Seed all wards (1 .. N) for this municipality
                $wardCount = (int) ($m['wards'] ?? 0);
                $wardRows  = [];

                for ($w = 1; $w <= $wardCount; $w++) {
                    $wardRows[] = [
                        'municipality_id' => $municipality->id,
                        'ward_number'     => $w,
                        'name'            => "Ward No. {$w}",
                        'office_location' => null,
                        'is_active'       => true,
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ];
                }

                if (! empty($wardRows)) {
                    Ward::upsert(
                        $wardRows,
                        ['municipality_id', 'ward_number'],
                        ['name', 'office_location', 'is_active', 'updated_at']
                    );
                }
            }
        });
    }

    /**
     * Fetches the 7 provinces, 77 districts, 753 municipalities & ward counts,
     * and caches locally so future runs need no internet connection.
     */
    private function loadDataset(): array
    {
        $cachePath = database_path('data/nepal_admin_cache.json');

        if (File::exists($cachePath)) {
            return json_decode(File::get($cachePath), true, 512, JSON_THROW_ON_ERROR);
        }

        $baseUrl = 'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset';

        $files = [
            'provinces_en'      => "{$baseUrl}/provinces/en.json",
            'provinces_np'      => "{$baseUrl}/provinces/np.json",
            'districts_en'      => "{$baseUrl}/districts/en.json",
            'districts_np'      => "{$baseUrl}/districts/np.json",
            'municipalities_en' => "{$baseUrl}/municipalities/en.json",
            'municipalities_np' => "{$baseUrl}/municipalities/np.json",
        ];

        $dataset = [];
        foreach ($files as $key => $url) {
            $response = Http::timeout(30)->get($url);

            if (! $response->successful()) {
                throw new RuntimeException("Failed to fetch dataset from {$url} (HTTP {$response->status()}).");
            }

            $dataset[$key] = $response->json();
        }

        File::ensureDirectoryExists(dirname($cachePath));
        File::put($cachePath, json_encode($dataset, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return $dataset;
    }
}