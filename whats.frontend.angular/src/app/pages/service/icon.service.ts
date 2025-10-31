import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface IconResponse {
    icons: Icon[];
}

interface Icon {
    [key: string]: unknown;
}

@Injectable()
export class IconService {
    private readonly http = inject(HttpClient);

    icons!: Icon[];

    selectedIcon: Icon | null = null;

    apiUrl = 'public/demo/data/icons.json';

    getIcons(): Observable<Icon[]> {
        return this.http.get<IconResponse>(this.apiUrl).pipe(
            map((response: IconResponse) => {
                this.icons = response.icons;

                return this.icons;
            })
        );
    }
}
