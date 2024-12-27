import {
  Component,
  EnvironmentInjector,
  EventEmitter,
  Output,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'auth',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  username: string = 'abcd';
  password: string = '';

  async login() {
    const payload = {
      username: this.username,
      password: this.password,
    };

    const backendUrl = environment.BACKEND_URL;
    if (!backendUrl) throw new Error('Missing backend url');

    const res = await fetch(backendUrl + '/login', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    });

    await res.body?.cancel();
    this.loggedIn.emit(res.status == 200);
  }

  @Output() loggedIn = new EventEmitter<boolean>();
}
