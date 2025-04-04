import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  // Inyecciones
  private fb: FormBuilder = inject(FormBuilder);
  formUtils = FormUtils;

  // -----------------------
  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array(
      [
        ['Metal Gear', Validators.required],
        ['GTA V', Validators.required],
      ],
      Validators.minLength(2)
    ),
  });

  // Propiedad Dinamica
  newFavorite = new FormControl('', Validators.required)

  // Metodos
  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  onAddToFavorites() {
    //Si no es válido no añade
    if (!this.newFavorite.valid) return;
    // Tomamos el valor del juego nuevo
    const newGame = this.newFavorite.value;
    // Añadimos el juego al array
    this.favoriteGames.push(this.fb.control( newGame, Validators.required ));

    this.newFavorite.reset();
  }

  onDeleteFavorite(i: number) {
    this.favoriteGames.removeAt(i);
  }

  onSubmit() {
    console.log(this.myForm.value)
    this.myForm.markAllAsTouched();
  }
}
