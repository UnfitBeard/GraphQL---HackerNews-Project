import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../modules/material/material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [MatSidenavModule, MatButtonModule, MaterialModule,RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
