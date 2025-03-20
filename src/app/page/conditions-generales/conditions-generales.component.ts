import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conditions-generales',
  templateUrl: './conditions-generales.component.html',
  styleUrls: ['./conditions-generales.component.scss']
})
export class ConditionsGeneralesComponent {
  constructor(public dialogRef: MatDialogRef<ConditionsGeneralesComponent>) {}

  fermer(): void {
    this.dialogRef.close();
  }
}