import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentDocumentation, DocumentationService, InputType, MethodType, OutputType } from '../documentation.service';

/**
 * Displays the component API: inputs, outputs and methods.
 */
@Component({
  selector: 'docs-component-api',
  templateUrl: './component-api.component.html',
  styleUrls: ['./component-api.component.sass']
})
export class ComponentApiComponent implements OnChanges {
  @Input() componentId: string;
  @Input() componentType: 'components' | 'directives';

  documentation$: Observable<ComponentDocumentation>;
  inputs$: Observable<InputType[]>;
  outputs$: Observable<OutputType[]>;
  methods$: Observable<MethodType[]>;
  selector$: Observable<string>;
  hasOutputs$: Observable<boolean>;
  hasInputs$: Observable<boolean>;
  hasMethods$: Observable<boolean>;

  constructor(
    private documentation: DocumentationService
  ) { }

  /**
   * @ignore
   */
  ngOnChanges() {
    this.documentation$ = this.documentation.getComponentDocumentation$(this.componentId, this.componentType);
    this.selector$ = this.documentation$.pipe(map(d => d ? d.selector : ''));
    this.inputs$ = this.documentation$
      .pipe(
        map(d => d ? d.inputsClass || [] : []),
        map(sortByName)
      );
    this.outputs$ = this.documentation$
      .pipe(
        map(d => d ? d.outputsClass || [] : []),
        map(sortByName)
      );
    this.methods$ = this.documentation$
      .pipe(
        map(d => d ? d.methodsClass || [] : []),
        map(sortByName)
      );
    this.hasOutputs$ = this.outputs$.pipe(map(a => a.length > 0));
    this.hasInputs$ = this.inputs$.pipe(map(a => a.length > 0));
    this.hasMethods$ = this.methods$.pipe(map(a => a.length > 0));
  }

  /**
   * @ignore
   */
  getInputType(input: InputType): Observable<string> {
    return this.documentation.getInputType({
      componentId: this.componentId,
      componentType: this.componentType,
      input
    });
  }
}

function sortByName<T extends {name: string}>(arr: T[]): T[] {
  const result = (arr || []).slice(0);
  result.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  return result;
}
