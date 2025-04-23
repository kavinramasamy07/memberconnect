import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

export class Opportunity{
  public id:string='';
  public name:string='';
  public place:string ='';
  public summary:string=''; 
  public url:string=''; 
  

  constructor(
    id:string,
    name: string,
    place: string,
    summary: string,
    url: string
  
  
  ) {
    this.id=id;
    this.name = name;
    this.place = place;
    this.summary = summary;
    this.url = url;
    }

}


@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CardModule,
      ButtonModule,
      CommonModule,
      DialogModule,
      ],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.css'
})
export class OpportunitiesComponent {

  public visible: boolean=false;
  public showConfirmation: boolean =false;
  
  opportunities: Opportunity[] = [];
    constructor() { }
    ngOnInit(): void {
      this.fetchData();
    }
  
  fetchData(){

        var opp1Description = `For Graduating Seniors (Chicago Residents): Apply for the One Summer Chicago On the Money
(OTM) Paid Internship for Chicago Residents As an OTM money mentor, you will be able to get trained
to conduct, lead hybrid (some in-person, some online) financial education presentations for youth
employees through One Summer Chicago, have the opportunity to meet with professionals in a career
field of your interest, and earn a financial literacy certification.`;
        var opp1 = new Opportunity('1','OTM Money Mentor', 'Chicago', opp1Description, 'https://www.otmonline.org/join-the-team');

        var opp2Description = `For Rising Seniors: Apply for the Urban Alliance High School Internship Program (HSIP) to get
connected to a paid internship, job skills training, unique mentoring experiences, and professional
development opportunities that can prepare you for the workforce, college, or trade school!`;
        var opp2 = new Opportunity('2','Urban Alliance Internship', 'Chicago', opp2Description, 'https://www.urbanalliance.org/high-school-internship-program/' );


        var opp3Description = `For Graduating Seniors: Apply to the EBF Summer Internship whether you aim to become a producer, journalist,
web developer, engineer, business executive, PR agent, sales representative, or pursue any career in
media, entertainment, or technology, the EBF Summer Internship is here to launch your career.`
        var opp3 = new Opportunity('3','Emma Bowen Foundation Internship', 'Chicago', opp3Description,'https://www.emmabowenfoundation.org/summer2025' );
        this.opportunities = [opp1, opp2, opp3];
      
    }
    

}
