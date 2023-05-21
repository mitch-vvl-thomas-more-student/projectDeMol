import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GeoCode } from 'src/app/interfaces/geoCode';
import { GeoCodeService } from 'src/app/services/geocode.service';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover.component.html',
})
export class PopoverContentComponent {
  @Input() latitude: number;
  @Input() longitude: number;
  address: GeoCode;

  constructor(private geoCodeService: GeoCodeService, private popoverController: PopoverController) { }

  ngOnInit() {
    if (this.latitude && this.longitude)
      this.getAddress();
  }

  async getAddress() {
    try {
      this.address = await this.geoCodeService.getGeoCode(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error retrieving address:', error);
    }
  }

  hideMap() {
    //   this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }
}

