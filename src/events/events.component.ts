import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../app/auth.service';

export class Event{
  public id:string='';
  public  name:string='';
  public time:string='';
  public place:string ='';
  public summary:string=''; 
  public description:string='';
  public imageUrl: string= '';
  public isRegistered: boolean = false;

  constructor(
    id:string,
    name: string,
    time: string,
    place: string,
    summary: string,
    description: string,
    imageUrl: string,
    isRegistered: boolean
  ) {
    this.id=id;
    this.name = name;
    this.time = time;
    this.place = place;
    this.summary = summary;
    this.description = description;
    this.imageUrl = imageUrl;
    this.isRegistered= isRegistered;
  }

}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    HttpClientModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})

export class EventsComponent implements OnInit{
  
  public visible: boolean=false;
  public showConfirmation: boolean =false;
  selectedEvent: Event | null=null;
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  events: Event[] = [];
  constructor() { }
  ngOnInit(): void {
    this.fetchData();
  }

  
  
  fetchData(){

    const chapter = this.authService.chapter;
    this.authService.getIdToken().subscribe((token) => {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    var url=`https://api.junioreconomicclub.org/event/retrieveList?chapter=${chapter}`;
    this.httpClient.get(url, { headers })
    .subscribe((e: any) => {
     // console.log(e);
      this.events = e.map((event: {id:string, title: string; startTime: any; endTime: any; location: string; description: string; registeredMembers: string[] }) => {
        var userId = this.authService.userId;
        var isRegistered = event.registeredMembers.includes(userId??"");
        return new Event(
          event.id,
          event.title,                     // Title
          this.formatTime(event.startTime, event.endTime),  // Time (combining start and end time)
          event.location,                  // Place
          '',                              // Summary (you can derive or use this field as needed)
          event.description,               // Description
          'https://cdn.prod.website-files.com/61dfe01d7c07e8e67a2a7a9a/61dfe01d7c07e887742a7aa7_Group%2051.svg',                               // imageUrl (assuming no image URL is provided in the API)
          isRegistered
        );
      });

    });
    });
  }
  showDialog(event: any) {
    this.selectedEvent= event;
    this.visible = true;
 }
  register(event: any) {
    const chapter = this.authService.chapter;
    let registeredEvent = event;
    this.authService.getIdToken().subscribe((token) => {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      var url=`https://api.junioreconomicclub.org/event/register?id=${event.id}&chapter=${chapter}&eventChapter=${chapter}`;
      this.httpClient.get(url, { headers })
      .subscribe((e: any) => {
        this.showConfirmation = true;
        registeredEvent.isRegistered=true;
      });
    });
  }

  formatTime(startTime: string, endTime: string): string {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
  
    // Format the start and end times using Intl.DateTimeFormat
    const formatterStart = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',  // E.g., "Saturday"
      year: 'numeric',
      month: 'long',    // E.g., "December"
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true      // Use 12-hour format
    });

    const formatterEnd = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    });
  
    const formattedStart = formatterStart.format(startDate);
    const formattedEnd = formatterEnd.format(endDate);
  
    return `${formattedStart} - ${formattedEnd}`;
  }

}
