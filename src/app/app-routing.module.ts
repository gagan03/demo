import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostlistComponent } from './posts/post-list/post-list.component';

const routes: Routes = [

  {path:'create',component:PostCreateComponent},
  {path:'list',component:PostlistComponent},
  {path:'edit/:postId',component:PostCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
