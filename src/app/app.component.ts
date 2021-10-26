import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService, Restaurant } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "amplify-angular-app";
  public createForm: FormGroup;

  public restaurants: Array<Restaurant> = [];

  private subscription: Subscription | null = null;

  constructor(private api: APIService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      city: ["", Validators.required],
    });
  }

  async ngOnInit(){
    this.api.ListRestaurants().then(e => {
      this.restaurants = e.items as Restaurant[]
    })
    this.subscription = <Subscription>(
      this.api.OnCreateRestaurantListener.subscribe((e: any) => {
        const newRestaurant = e.value.data.onCreateRestaurant;
        this.restaurants = [newRestaurant, ...this.restaurants]
      })
    )
  }
  public onCreate(restaurant: Restaurant) {
    this.api
      .CreateRestaurant(restaurant)
      .then((event) => {
        console.log("item created!");
        this.createForm.reset();
      })
      .catch((e) => {
        console.log("error creating restaurant...", e);
      });
  }
}
