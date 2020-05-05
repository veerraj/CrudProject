import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './shared/user.service';
import { User } from './shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crudProj';
  myform:FormGroup;
  users;
  btnValue;
  editMode;
  id;
  

  constructor(private service:UserService)
  { }
  ngOnInit()
  {
    this.btnValue="Create"
    this.editMode=false;
    this.getusers()
     this.myform=new FormGroup({
       'name':new FormControl(null,Validators.required),
       'email':new FormControl(null,Validators.required),
       'pwd':new FormControl(null,Validators.required),

     })

  }

  getusers()
  {
     this.service.getUser().subscribe(
        (res)=>{
          console.log(res)
             this.users=res;
        }
     )
  }

  submit()
  {
     if(this.editMode)
     {
        console.log(this.myform.value)
        const updatedUser=new User(
          this.myform.value.name,
          this.myform.value.email,
          this.myform.value.pwd
        )
        this.service.editUser(this.id,updatedUser).subscribe(
          (res)=>{
            console.log(res)
            this.myform.reset()
            this.getusers()
            this.editMode=false;
            this.btnValue='Create'
          }
        )
     }
     else
     {
        console.log(this.myform.value)
        const newUser=new User(
          this.myform.value.name,
          this.myform.value.email,
          this.myform.value.pwd
        )
        this.service.createUser(newUser).subscribe(
          (res)=>{
            console.log(res)
            this.myform.reset()
            this.getusers()
          }
        )
     }
          
  }

  delete(id)
  {
    this.service.delteUser(id).subscribe(
      (res)=>{
        console.log(res)
        this.getusers()
      }
    )
  }
  edit(user:User,id:string)
  {
     this.myform.setValue({
       'name':user.name,
       'email':user.email,
       'pwd':''
     })
     this.btnValue="Update"
    this.editMode=true;
    this.id=id;
  }
}
