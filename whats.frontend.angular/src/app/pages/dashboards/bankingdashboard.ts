import { Component } from '@angular/core';
import { HeaderWidget } from './banking/headerwidget';
import { StatsBankingWidget } from './banking/statsbankingwidget';
import { RecentTransactionsWidget } from './banking/recenttransactionswidget';
import { OverviewWidget } from './banking/overviewwidget';
import { RecentTransactionsTwoWidget } from './banking/recenttransactionstwowidget';
import { MonthlyPaymentsWidget } from './banking/monthlypaymentswidget';
import { ProductService } from '@/pages/service/product.service';

@Component({
    selector: 'p-banking-dashboard',
    standalone: true,
    imports: [HeaderWidget, StatsBankingWidget, RecentTransactionsWidget, OverviewWidget, RecentTransactionsTwoWidget, MonthlyPaymentsWidget],
    providers: [ProductService],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <p-header-widget class="col-span-12" />
            <p-stats-banking-widget />

            <div class="col-span-12 xl:col-span-4">
                <p-recent-transactions-widget />
            </div>
            <div class="col-span-12 xl:col-span-8">
                <p-overview-widget />
            </div>
            <div class="col-span-12 lg:col-span-6">
                <p-recent-transactions-two-widget />
            </div>
            <div class="col-span-12 lg:col-span-6">
                <p-monthly-payments-widget />
            </div>
        </div>
    `
})
export class BankingDashboard {}
