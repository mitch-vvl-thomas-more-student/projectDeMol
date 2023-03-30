import { Component, Input, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import Kandidaat from 'src/app/types/Kandidaat';

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.scss'],
})
export class ReorderComponent  implements OnInit {
  @Input() kandidaten: Kandidaat[]
  constructor() { }

  ngOnInit() {}
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete();
  }
}
