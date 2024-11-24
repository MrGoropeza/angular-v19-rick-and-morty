import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
} from '@angular/core';

@Component({
  selector: 'ram-infinite-scroll-spinner',
  imports: [],
  template: ` <span class="loader"></span> `,
  styles: `
    .loader {
      width: calc(100px - 24px);
      height: 50px;
      position: relative;
      animation: flippx 2s infinite linear;
    }
    .loader:before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: red;
      transform-origin: -24px 50%;
      animation: spin 1s infinite linear;
    }
    .loader:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50% , -50%);
      background: red;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    @keyframes flippx {
      0%, 49% {
        transform: scaleX(1);
      }
      50%, 100% {
        transform: scaleX(-1);
      }
    }
    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollSpinnerComponent implements OnInit {
  onInit = output();

  ngOnInit(): void {
    this.onInit.emit();
  }
}
