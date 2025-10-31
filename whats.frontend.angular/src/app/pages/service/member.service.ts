import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Member } from '@/types/member';

interface MemberResponse {
    data: Member[];
}

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private readonly http = inject(HttpClient);

    getMembers(): Promise<Member[]> {
        return this.http
            .get<MemberResponse>('/demo/data/members.json')
            .toPromise()
            .then((res) => res?.data as Member[] || [])
            .then((data) => data);
    }
}
