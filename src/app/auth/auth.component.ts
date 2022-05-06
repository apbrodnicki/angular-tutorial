import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
	isLoginMode = true;
	isLoading = false;
	error: string = null;
	@ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

	private closeSub: Subscription;

	constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		this.isLoading = true;

		const email = form.value.email;
		const password = form.value.password;

		let authObservable: Observable<AuthResponseData>;

		if (this.isLoginMode) {
			authObservable = this.authService.login(email, password);
		} else {
			authObservable = this.authService.signup(email, password);
		}

		authObservable.subscribe(
			responseData => {
				this.isLoading = false;
				this.router.navigate(['/recipes']);
			},
			errorMessage => {
				this.error = errorMessage;
				this.showErrorAlert(errorMessage);
				this.isLoading = false;
			}
		 );

		form.reset();
	}

	onHandleError() {
		this.error = null;
	}

	ngOnDestroy(): void {
		if (this.closeSub) {
			this.closeSub.unsubscribe();
		}
	}

	private showErrorAlert(message: string) {
		const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
		const hostViewContainerRef = this.alertHost.viewContainerRef;

		hostViewContainerRef.clear();

		const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

		componentRef.instance.message = message;
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe();
			hostViewContainerRef.clear();
		});
	}
}
