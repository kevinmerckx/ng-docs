import { AfterViewChecked, Component, Directive, ElementRef, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'docs-component-documentation',
  templateUrl: './component-documentation.component.html',
  styleUrls: ['./component-documentation.component.sass']
})
export class ComponentDocumentationComponent {
  @Input() componentId: string;
  @Input() componentType: 'directives';
  @Input() componentTitle: string;

  examples: ComponentExampleDirective[] = [];

  tab$: Observable<'overview' | 'examples' | 'api'>;
  isOverview$: Observable<boolean>;
  isExamples$: Observable<boolean>;
  isApi$: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tab$ = this.route.queryParams.pipe(map(p => p.tab || 'overview'));
    this.isOverview$ = this.tab$.pipe(map(v => v === 'overview'));
    this.isExamples$ = this.tab$.pipe(map(v => v === 'examples'));
    this.isApi$ = this.tab$.pipe(map(v => v === 'api'));
  }

  registerExample(example: ComponentExampleDirective) {
    this.examples.push(example);
  }

  select(tab: 'overview' | 'examples' | 'api') {
    this.router.navigate(['.'], {
      queryParamsHandling: 'merge',
      queryParams: {
        tab
      },
      relativeTo: this.route,
    });
  }
}

@Directive({
  selector: '[docsAnchorContainer]'
})
export class AnchorContainerDirective implements AfterViewChecked {
  @Input() docsAnchorContainer: string;
  private anchors: AnchorDirective[] = [];
  private currentAnchor: string;

  constructor(private elementRef: ElementRef) {}

  registerAnchor(anchor: AnchorDirective) {
    this.anchors.push(anchor);
  }

  ngAfterViewChecked() {
    if (this.currentAnchor === this.docsAnchorContainer) {
      return;
    }

    this.currentAnchor = this.docsAnchorContainer;
    const element = this.elementRef.nativeElement as HTMLElement;
    const anchor = (this.anchors.find(a => a.docsAnchor === this.docsAnchorContainer).elementRef.nativeElement) as HTMLElement;

    element.scrollTop = anchor.offsetTop - element.offsetTop - 15;
  }
}

@Directive({
  selector: '[docsAnchor]'
})
export class AnchorDirective {
  @Input() docsAnchor: string;

  constructor(
    private container: AnchorContainerDirective,
    public elementRef: ElementRef
  ) {
    this.container.registerAnchor(this);
  }
}

@Directive({
  selector: '[docsComponentExample]'
})
export class ComponentExampleDirective {
  @Input() docsComponentExample: string;

  constructor(
    private documentation: ComponentDocumentationComponent,
    public template: TemplateRef<any>
  ) {
    this.documentation.registerExample(this);
  }
}
