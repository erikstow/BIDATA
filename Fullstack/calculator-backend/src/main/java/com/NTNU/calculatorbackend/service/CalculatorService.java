package com.NTNU.calculatorbackend.service;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public double evaluateExpression(String expression) {
        Expression exp = new ExpressionBuilder(expression).build();
        return exp.evaluate();
    }
}
