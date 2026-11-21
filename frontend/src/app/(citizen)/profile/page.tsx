'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Save } from 'lucide-react';
import { NEPAL_LOCATIONS, WARDS_LIST } from '@/lib/nepal-locations';

interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
}

export default function CitizenProfilePage() {
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: 'Subash Pant',
      email: 'citizen@wardwatch.np',
      phone: '+977-9800000000',
      province: 'Bagmati',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metro',
      ward: 'Ward 10',
    },
  });

  const selectedProvince = watch('province');
  const selectedDistrict = watch('district');
  const districts = Object.keys(NEPAL_LOCATIONS[selectedProvince] || {});
  const municipalities = NEPAL_LOCATIONS[selectedProvince]?.[selectedDistrict] || [];

  const onSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl bg-card border border-border p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Citizen Profile</h1>
        <p className="text-sm text-muted mt-1">
          Manage your contact details and default home ward.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-4 py-2.5 text-xs text-primary font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile preferences updated!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Full name</label>
          <input
            type="text"
            {...register('fullName', { required: true })}
            className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Phone (optional)</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <h2 className="text-sm font-semibold mb-3">Your home ward</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Province</label>
              <select
                {...register('province', {
                  onChange: (e) => {
                    const p = e.target.value;
                    const d = Object.keys(NEPAL_LOCATIONS[p])[0];
                    setValue('district', d);
                    setValue('municipality', NEPAL_LOCATIONS[p][d][0]);
                  },
                })}
                className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {Object.keys(NEPAL_LOCATIONS).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">District</label>
              <select
                {...register('district', {
                  onChange: (e) => {
                    const d = e.target.value;
                    setValue('municipality', NEPAL_LOCATIONS[selectedProvince]?.[d]?.[0] || '');
                  },
                })}
                className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Municipality</label>
              <select
                {...register('municipality')}
                className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {municipalities.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Ward</label>
              <select
                {...register('ward')}
                className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                {WARDS_LIST.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white dark:text-slate-950 font-semibold px-5 py-2.5 text-sm transition-opacity cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save changes
        </button>
      </form>
    </div>
  );
}