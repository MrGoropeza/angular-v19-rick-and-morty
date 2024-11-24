import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  resource,
  ResourceStatus,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiResponse } from '../../models/api-response.model';
import { Character } from '../../models/character.model';
import { InfiniteScrollSpinnerComponent } from '../infinite-scroll-spinner/infinite-scroll-spinner.component';

@Component({
  selector: 'ram-character-list',
  imports: [MatCardModule, MatButtonModule, InfiniteScrollSpinnerComponent],
  templateUrl: './character-list.component.html',
  styles: `
    .example-card {
      max-width: 400px;
      color: white;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 1rem;
      padding: 1rem;
    }

    .loader-item {
      width: 100%;
      height: 8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      grid-column: 1 / -1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent {
  page = signal(1);
  characters = signal<Character[]>([]);

  charactersResponse = resource<ApiResponse<Character>, { page: number }>({
    request: () => ({ page: this.page() }),
    loader: async ({ request, abortSignal, previous }) => {
      if (previous.status === ResourceStatus.Loading) return;

      // const timeout = await new Promise<number>((resolve) =>
      //   setTimeout(resolve, 2000)
      // );

      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${request.page}`,
        { signal: abortSignal }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      return await response.json();
    },
  });

  hasMorePages = computed(() => {
    const response = this.charactersResponse.value();

    if (this.charactersResponse.status() === ResourceStatus.Loading)
      return true;

    return !!response?.info.next;
  });

  reducerEffect = effect(() => {
    const response = this.charactersResponse.value();
    if (!response) return;

    this.characters.update((characters) => [
      ...characters,
      ...response.results,
    ]);
  });
}
