import {   Component,Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { Postservice } from '../post.service'
import { Subscription } from 'rxjs';
import { bootstrap } from 'bootstrap'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { SidebarModule } from 'ng-sidebar'
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.component.html',

})

export class PostlistComponent implements OnInit , OnDestroy
{

  closeResult = '';
  page=1;
  pageSize=2;
  postcounts=0;


  // post =[
  //   {title:'First post', content:"This is first post"},
  //   {title:'Second post', content:"This is second post"},
  //   {title:'Third post', content:"This is third post"}
  //   ]



 post:Post[]=[];

 private postId:string|any;

private postsSub:Subscription;



constructor(public postservice:Postservice, private modalService: NgbModal,public route:ActivatedRoute)
{

}


ngOnInit()
{
  this.postsSub=this.postservice.getpostupdatedListener().subscribe(
    ({posts, postcount})=>
    {
      this.post=posts;
      this.postcounts=postcount;
      console.log(this.post, this.postcounts);
    }
  );

  this.postservice.getPosts(this.pageSize,this.page);
}

onpagechange()
{
  console.log(this.page);
  this.postservice.getPosts(this.pageSize,this.page);
}


ondelete(postid:string)
{
  this.postservice.deletepost(postid);
}


ngOnDestroy()
{
  this.postsSub.unsubscribe();
}

open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

onget(postid:string)
{
   this.postId=this.postservice.getPost(postid);
   console.log(this.postId);
}



onupdate(id:string,form : NgForm)
{


      this.postservice.updatePost(id,form.value.device,form.value.signal,form.value.state);

      this.postservice.getPosts(this.pageSize,this.page);

  }


}


