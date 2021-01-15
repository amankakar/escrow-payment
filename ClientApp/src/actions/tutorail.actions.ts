import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { tutorial } from "../models/tutorail.models";

// Section 2
export const ADD_TUTORIAL = "[TUTORIAL] Add";
export const REMOVE_TUTORIAL = "[TUTORIAL] Remove";

// Section 3
export class AddTutorial implements Action {
  readonly type = ADD_TUTORIAL;

  constructor(public payload: tutorial) {}
}

export class RemoveTutorial implements Action {
  readonly type = REMOVE_TUTORIAL;

  constructor(public payload: number) {}
}

// Section 4
export type Actions = AddTutorial | RemoveTutorial;
