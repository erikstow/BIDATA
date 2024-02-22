package com.NTNU.calculatorbackend.model;

public class CalculationResult {
    private String expression;
    private double result;
    private String error;

    public CalculationResult(String expression, double result) {
        this.expression = expression;
        this.result = result;
        this.error = null; // No error since the calculation was successful
    }

    public CalculationResult(String expression, Exception e) {
        this.expression = expression;
        this.error = e.getMessage();
        this.result = Double.NaN; // Use NaN to represent an invalid result
    }

    // Getter for expression
    public String getExpression() {
        return expression;
    }

    // Setter for expression
    public void setExpression(String expression) {
        this.expression = expression;
    }

    // Getter for result
    public double getResult() {
        return result;
    }

    // Setter for result
    public void setResult(double result) {
        this.result = result;
    }

    // Getter for error
    public String getError() {
        return error;
    }

    // Setter for error
    public void setError(String error) {
        this.error = error;
    }
}
