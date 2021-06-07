import { Injectable } from '@angular/core';
import { Post } from './post.model'
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { map } from 'rxjs/operators'

@Injectable({providedIn:'root'})
export class Postservice
{
  private posts:Post[]=[];
  private postcount=0;

  private postupdated = new Subject<{posts: Post[], postcount:number}>();

constructor(private http:HttpClient)
{
}

// getPosts()
// {
// this.http.get<{message:string;posts:any}>('http://localhost:3000/api/posts')
// // .pipe(map((postdata) => {
// // return postdata.posts.map(post =>
// //   {
// //     return {
// //       title:post.title,
// //       content:post.content,
// //       id:post._id
// //     }
// //   })

// // }))
// .subscribe((transformData)=>
// {
// this.posts = transformData.posts;
// this.postupdated.next([...this.posts]);
// });


// }

getPosts(postsperpage:number,currentPage:number) {

const queryParams=`?pagesize=${postsperpage}&page=${currentPage}`;

  this.http
    .get<{ message: string; posts: any,postcount:number}>(
      "http://localhost:5000/api/posts"+queryParams)
    .pipe(map((postData) => {
      return {posts: postData.posts.map(post => {

        return {
          device: post.device,
          state: post.state,
          signal:post.signal,
          id: post._id
        };

      }),
      postcount: postData.postcount
    };
  }))
    .subscribe(transformedPosts => {
      this.posts = transformedPosts.posts;


      this.postcount=transformedPosts.postcount;

      this.postupdated.next({posts :[...this.posts], postcount: this.postcount});
    });
}

getpostupdatedListener()
  {
    return this.postupdated.asObservable();
  }


updatePost(id:string,device:string,signal:string,state:string)
{
  const post:Post={id:id,device:device,signal:signal,state:state};
  this.http.put('http://localhost:5000/api/posts/'+id,post)
  .subscribe(response =>
    {
       //this.getPosts();
    }
    )

}
getPost(id:string)
{
  return {...this.posts.find(p => p.id === id)};
}
addPost(device:string,signal:string,state:string)
{
  const post:Post={id:"",device:device,signal:signal,state:state};

  this.http.post<{message:string, post:Post}>('http://localhost:5000/api/posts',post)
  .subscribe((responsedata)=>
  {
    console.log(responsedata);
    // this.posts = [...this.posts, responsedata.post];
    // this.postupdated.next([...this.posts]);

    this.posts.push(post)
    this.postcount += 1;
    this.postupdated.next({posts :[...this.posts], postcount: this.postcount});

  });

}

deletepost(postid:string)
{
  console.log(postid)
  this.http.delete("http://localhost:5000/api/posts/"+postid)
  .subscribe(()=>
  {
   const updatedpost=this.posts.filter(post=> post.id != postid);
   this.posts=updatedpost;
   this.postcount -= 1;
   this.postupdated.next({posts :[...this.posts], postcount: this.postcount});

  }
  )
}

}


