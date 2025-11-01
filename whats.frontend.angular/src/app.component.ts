import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'p-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        this.initializeLanguageAndFont();
    }

    private initializeLanguageAndFont(): void {
        // Get stored preferences or defaults
        const language = localStorage.getItem('language') || 'ar';
        const font = localStorage.getItem('font') || 'font-tajawal';

        // Update HTML attributes
        const html = document.documentElement;
        html.lang = language;
        html.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr';

        // Apply font class
        const fontClasses = ['font-tajawal', 'font-poppins', 'font-droid-sans', 'font-al-jazeera'];
        fontClasses.forEach(cls => html.classList.remove(cls));
        html.classList.add(font);

        // Store preferences for consistency
        localStorage.setItem('language', language);
        localStorage.setItem('font', font);
    }
}
