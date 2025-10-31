import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { TokenService } from './token.service';

describe('WebSocketService', () => {
    let service: WebSocketService;
    let _tokenService: jasmine.SpyObj<TokenService>;

    beforeEach(() => {
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken']);

        TestBed.configureTestingModule({
            providers: [WebSocketService, { provide: TokenService, useValue: tokenServiceSpy }]
        });

        service = TestBed.inject(WebSocketService);
        _tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    });

    afterEach(() => {
        service.disconnect();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false when not connected', () => {
        expect(service.isConnected()).toBeFalse();
    });

    describe('getConnectionStatus', () => {
        it('should return observable of connection status', (done) => {
            service.getConnectionStatus().subscribe((status) => {
                expect(status).toBeDefined();
                expect(status.connected).toBeDefined();
                done();
            });

            service.disconnect();
        });
    });

    describe('disconnect', () => {
        it('should handle disconnection gracefully', () => {
            expect(() => service.disconnect()).not.toThrow();
        });
    });
});
