import { Component, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';

import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-frames',
  imports: [Breadcrumbs],
  templateUrl: './frames.html',
})
export class Frames {
  private readonly sanitizer = inject(DomSanitizer);

  readonly messageFromFrame = signal<string | null>(null);

  readonly frameUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    '/embedded-frame.html',
  );

  readonly nestedFrameUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl('/nested-frame.html');
}
