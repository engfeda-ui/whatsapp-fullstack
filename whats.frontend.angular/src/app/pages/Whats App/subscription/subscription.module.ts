import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionService } from './subscription.service';

@NgModule({
    declarations: [],
    imports: [CommonModule, SubscriptionRoutingModule],
    providers: [SubscriptionService]
})
export class SubscriptionModule {}
