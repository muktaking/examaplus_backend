import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { RolePermitted } from 'src/users/user.entity';
import { CreateExamDto } from './dto/exam.dto';
import { CreateFeedbackDto } from './dto/flag.dto';
import { ExamsService } from './exams.service';

//@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examService: ExamsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.mentor)
  @UsePipes(ValidationPipe)
  async createExam(@Body() createExamDto: CreateExamDto, @Req() req) {
    return await this.examService.createExam(createExamDto, req.user.id);
  }

  // // @Post()
  // // @UseGuards(AuthGuard("jwt"))
  // // async findProfileByUserEmail {
  // //   return await this.examService.findProfileByUserEmail();
  // // }

  // @Get("miniinfo")
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Role(RolePermitted.student)
  // async findUserExamInfo(@Req() req) {
  //   return await this.examService.findUserExamInfo(req.user.email);
  // }

  // @Get("total")
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Role(RolePermitted.student)
  // @UseGuards(AuthGuard("jwt"))
  // async findExamTotalNumber() {
  //   return await this.examService.findExamTotalNumber();
  // }

  @Get()
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Role(RolePermitted.student)
  async findAllExams() {
    return await this.examService.findAllExams();
  }

  // @Get("free")
  // async findAllFreeExams() {
  //   return await this.examService.findAllFreeExams();
  // }

  @Get('/latest')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async findLatestExam() {
    return await this.examService.findLatestExam();
  }

  @Get('/featured')
  async findFeaturedExam() {
    return await this.examService.getFeaturedExams();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.student)
  async findExamById(@Param('id') id) {
    return await this.examService.findExamById(id);
  }

  @Get('/category/:id')
  async findExamByCatId(@Param('id') id) {
    return await this.examService.findExamByCatId(id);
  }

  @Get('questions/:id')
  @UseGuards(AuthGuard('jwt'))
  @Role(RolePermitted.student)
  async findQuestionsByExamId(@Param('id') id) {
    return await this.examService.findQuestionsByExamId(id);
  }

  @Get('free/questions/:id')
  async findFreeQuestionsByExamId(@Param('id') id) {
    return await this.examService.findFreeQuestionsByExamId(id);
  }

  @Get('feedback/:id')
  async getFeedbackByExamId(@Param() examId) {
    return await this.examService.getFeedbackByExamId(examId.id);
  }

  // @Get('feedback')
  // @Role(RolePermitted.mentor)
  // async getPendingFeedbackByExamId() {
  //   return await this.examService.getPendingFeedbackByExamId();
  // }

  @Post('feedback')
  @UsePipes(ValidationPipe)
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.examService.createFeedback(createFeedbackDto);
  }

  @Patch('feedback')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.mentor)
  async ChangePendingStatus(@Body() ids) {
    return await this.examService.changePendingStatus(ids.ids);
  }

  @Patch(':id')
  async updateExamById(@Param() examId, @Body() createExamDto: CreateExamDto) {
    return await this.examService.updateExamById(examId.id, createExamDto);
  }

  @Delete(':id')
  @Role(RolePermitted.coordinator)
  async deleteQuestionById(@Param() examId) {
    return await this.examService.deleteExam(examId.id);
  }

  @Delete()
  @Role(RolePermitted.coordinator)
  async deleteQuestion(@Body() examIds) {
    return await this.examService.deleteExam(...examIds.ids);
  }
}
