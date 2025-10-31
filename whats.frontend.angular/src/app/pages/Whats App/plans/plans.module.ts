import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PlansRoutingModule } from './plans-routing.module';
import { PlansService } from './plans.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule, PlansRoutingModule],
    providers: [PlansService]
})
export class PlansModule {}
