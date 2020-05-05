import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl="http://127.0.0.1:5000/"
  constructor(private http:HttpClient) { 

  }
 
  createUser(user:User)
  {
      return this.http.post(this.baseUrl+'add',user);
  }

  getUser()
  {
     return this.http.get(this.baseUrl+'users')
  }

  delteUser(id:string)
  {
     return this.http.delete(this.baseUrl+'delete/'+`${id}`)
  }
  
  editUser(id,user:User)
  {
    return this.http.put(this.baseUrl+'update/'+`${id}`,user)
  }
}
