import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateComplaintDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: { user?: { sub?: number } },
  ) {
    const photoUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.complaintsService.create(dto, photoUrl, req?.user?.sub);
  }
}