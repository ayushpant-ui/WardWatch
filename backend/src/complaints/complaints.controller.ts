import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // Public / Ward-wide complaints feed
  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  // Logged-in citizen's own complaints ONLY
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyComplaints(@Req() req: { user: { sub?: number; id?: number } }) {
    const userId = req.user.sub ?? req.user.id;
    return this.complaintsService.findByUser(userId!);
  }

  // Attach authenticated citizen's userId on creation
  @UseGuards(JwtAuthGuard)
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
    @Req() req?: { user?: { sub?: number; id?: number } },
  ) {
    const photoUrl = file ? `/uploads/${file.filename}` : undefined;
    const userId = req?.user?.sub ?? req?.user?.id;
    return this.complaintsService.create(dto, photoUrl, userId);
  }
}