import { Component, Input, OnInit } from '@angular/core';
import Opmerking from 'src/app/types/Opmerking';

@Component({
  selector: 'app-hint-opmerking',
  templateUrl: './hint-opmerking.component.html',
  styleUrls: ['./hint-opmerking.component.scss'],
})
export class HintOpmerkingComponent  implements OnInit {
  @Input () opmerking: Opmerking;
  constructor() { }

  ngOnInit() {}

}
