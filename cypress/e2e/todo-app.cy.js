/// <reference types="cypress" />

describe("toDo app", () => {
  beforeEach(() => {
    // Mocking an API call using cy.intercept()
    it("should display todos from the api", () => {
      // Intercept the GET request to /todos and return a mock response
      cy.intercept("GET", "/todos", {
        statusCode: 200,
        body: [{ description: "Learn Cypress", done: false }],
      }).as("getTodos");
    });
    cy.visit("http://localhost:3000");
  });

  it("should fetch a 200", () => {
    cy.request("http://localhost:4730");
  });

  it("should have a input field", () => {
    cy.get("#todo-input").should("have.attr", "placeholder");
  });

  it("should have empty to do list by default", () => {
    cy.get("#todo-list li").should("have.length", 0);
  });

  it("should add a new todo", () => {
    cy.get("#todo-input").type("learn HTML");
    cy.get("#btn-add").click();
    cy.get("#todo-list").should("have.length", 1);
  });
});
