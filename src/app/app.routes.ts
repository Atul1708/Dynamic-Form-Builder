import { Routes } from '@angular/router';
import { CommonLayout } from './components/common-layout/common-layout';

export const routes: Routes = [
  {
    path: '',
    component: CommonLayout,
    title: 'Home Page',
  },
];
