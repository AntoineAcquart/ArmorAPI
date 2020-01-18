import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Armor } from "../armor/armor.entity";

@Injectable({
  providedIn: "root"
})
export class ArmorService {
  constructor(private http: HttpClient) {}
  url: string = "http://localhost:3000/armor/";
  getArmors() {
    return this.http
      .get<Armor[]>(this.url + "all")
      .pipe(catchError(this.handleError));
  }
  getArmor(armorName: string) {
    return this.http
      .get<Armor>(this.url + armorName)
      .pipe(catchError(this.handleError));
  }

  createArmor(armor: Armor) {
    return this.http.post<Armor>(this.url, armor)
    .pipe(catchError(this.handleError));
  }

  updateArmor(armor: Armor, armorName: string) {
    return this.http
      .put(this.url + armorName, armor)
      .pipe(catchError(this.handleError));
  }

  deleteArmor(armorName: string) {
    return this.http
      .delete(this.url + armorName)
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
