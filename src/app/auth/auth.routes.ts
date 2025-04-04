import { Routes } from "@angular/router";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path:'sign-up',
        component: RegisterPageComponent,
      },
      {
        path: '**',
        redirectTo: 'sign-up' //De esta manera todas las redirecciones llevan al sign-in
      }
    ],
  }

];

export default authRoutes;
