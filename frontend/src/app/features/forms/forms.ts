import { Component, signal } from '@angular/core';

import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';
import { FileHandling } from './file-handling/file-handling';
import { KitchenSinkForm } from './kitchen-sink/kitchen-sink-form';
import { WizardForm } from './wizard/wizard-form';

type TabId = 'inputs' | 'wizard' | 'files';

@Component({
  selector: 'app-forms',
  imports: [Breadcrumbs, KitchenSinkForm, WizardForm, FileHandling],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
})
export class Forms {
  readonly tabs: { id: TabId; label: string }[] = [
    { id: 'inputs', label: 'All inputs' },
    { id: 'wizard', label: 'Multi-step wizard' },
    { id: 'files', label: 'Files' },
  ];

  readonly activeTab = signal<TabId>('inputs');

  select(id: TabId): void {
    this.activeTab.set(id);
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const offset =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;

    if (offset === 0) {
      return;
    }

    event.preventDefault();
    const next = (index + offset + this.tabs.length) % this.tabs.length;
    this.select(this.tabs[next].id);
    document.getElementById(`tab-${this.tabs[next].id}`)?.focus();
  }
}
