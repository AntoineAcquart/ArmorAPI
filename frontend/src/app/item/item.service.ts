import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
import { Item } from "../item/item.entity";

@Injectable({
  providedIn: "root"
})
export class ItemService {
  constructor(private http: HttpClient) {}

  url: string = "http://localhost:3000/";
  getItems(typeItem: string) {
    return this.http
      .get<Item[]>(this.url + typeItem + "/all")
      .pipe(catchError(this.handleError));
  }
  getItem(typeItem: string, itemName: string) {
    return this.http
      .get<Item>(this.url + typeItem + "/" + itemName)
      .pipe(catchError(this.handleError));
  }

  createItem(typeItem: string, item: Item) {
    return this.http.post<Item>(this.url + typeItem, item);
  }

  updateItem(typeItem: string, item: Item, itemName: string) {
    return this.http
      .put(this.url + typeItem + "/" + itemName, item)
      .pipe(catchError(this.handleError));
  }

  deleteItem(typeItem: string, itemName: string) {
    return this.http
      .delete(this.url + typeItem + "/" + itemName)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }
}
