import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { Postservice } from '../post.service'
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls : ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit
{

private mode='create';
private postId:string|any;
 post:Post|any;


  constructor(public postservice:Postservice,public route:ActivatedRoute)
  {

  }


ngOnInit()
{
  this.route.paramMap.subscribe((paramMap:ParamMap)=>
  {
    if(paramMap.has('postId'))
    {
      this.mode='edit';
      this.postId=paramMap.get('postId');
      this.post=this.postservice.getPost(this.postId)
    }
    else{
      this.mode='create';
      this.postId="";

    }
  }
  )
}

  onSavepost(form : NgForm)
  {
    if(form.invalid)
    {
      return;
    }

    if(this.mode === 'create')
    {
      this.postservice.addPost(form.value.device,form.value.signal,form.value.state)
    }
    else
    {
      this.postservice.updatePost(this.postId,form.value.device,form.value.signal,form.value.state)
    }
    form.resetForm();


  }


}
