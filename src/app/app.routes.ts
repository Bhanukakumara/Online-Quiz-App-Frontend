import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './modules/teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './modules/student/student-dashboard/student-dashboard.component';
import { AdminMainComponent } from './modules/admin/admin-main/admin-main.component';
import { AdminAddUserComponent } from './modules/admin/admin-add-user/admin-add-user.component';
import { AdminViewAllUsersComponent } from './modules/admin/admin-view-all-users/admin-view-all-users.component';
import { AdminAddCourseComponent } from './modules/admin/admin-add-course/admin-add-course.component';
import { AdminViewAllCourseComponent } from './modules/admin/admin-view-all-course/admin-view-all-course.component';
import { AdminAddExamComponent } from './modules/admin/admin-add-exam/admin-add-exam.component';
import { AdminViewAllExamComponent } from './modules/admin/admin-view-all-exam/admin-view-all-exam.component';
import { AdminAddQuestionComponent } from './modules/admin/admin-add-question/admin-add-question.component';
import { AdminViewAllQuestionComponent } from './modules/admin/admin-view-all-question/admin-view-all-question.component';
import { TeacherMainComponent } from './modules/teacher/teacher-main/teacher-main.component';
import { StudentMainComponent } from './modules/student/student-main/student-main.component';
import { authGuard } from './core/guards/auth.guard';
import { StudentExamComponent } from './modules/student/student-exam/student-exam.component';
import { StudentPaperComponent } from './modules/student/student-paper/student-paper.component';
import { AdminViewAllResultComponent } from './modules/admin/admin-view-all-result/admin-view-all-result.component';
import { AdminUpdateQuestionComponent } from './modules/admin/admin-update-question/admin-update-question.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {path: 'dashboard', component: AdminMainComponent},
            {path: 'add-user', component: AdminAddUserComponent},
            {path: 'view-all-user', component: AdminViewAllUsersComponent},
            {path: 'create-course', component: AdminAddCourseComponent},
            {path: 'view-all-course', component: AdminViewAllCourseComponent},
            {path: 'create-exam', component: AdminAddExamComponent},
            {path: 'view-all-exam', component: AdminViewAllExamComponent},
            {path: 'add-question', component: AdminAddQuestionComponent},
            {path: 'view-all-question', component: AdminViewAllQuestionComponent},
            {path: 'view-all-result', component: AdminViewAllResultComponent},
            {path: 'edit-question/:questionId', component: AdminUpdateQuestionComponent}
        ]
    },
    {
        path: 'teacher',
        component: TeacherDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['TEACHER'] },
        children: [
            {path: 'dashboard', component: TeacherMainComponent},
            {path: 'view-all-course', component: AdminViewAllCourseComponent},
            {path: 'create-exam', component: AdminAddExamComponent},
            {path: 'view-all-exam', component: AdminViewAllExamComponent},
            {path: 'add-question', component: AdminAddQuestionComponent},
            {path: 'view-all-question', component: AdminViewAllQuestionComponent},
            {path: 'view-all-result', component: AdminViewAllResultComponent},
            {path: 'edit-question/:questionId', component: AdminUpdateQuestionComponent}
        ]
    },
    {
        path: 'student',
        component: StudentDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['STUDENT'] },
        children: [
            {path: 'dashboard', component: StudentMainComponent},
            {path: 'exam', component: StudentExamComponent},
            {path: 'exam/paper', component: StudentPaperComponent},
            {path: 'view-all-result/:studentId', component: AdminViewAllResultComponent}
        ]
    }
];
