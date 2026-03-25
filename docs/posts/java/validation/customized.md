## 1. 创建自定义注解
```java
package com.example.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValueValidator.class)
@Documented
public @interface EnumValue {

    String message() default "字段值不在枚举范围内";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * 指定枚举类
     */
    Class<? extends Enum<?>> enumClass();
    
    /**
     * 指定枚举中用于校验的方法名（可选）
     * 默认为 name() 方法
     */
    String method() default "name";
    
    /**
     * 是否允许为空
     */
    boolean allowNull() default false;
}
```
## 2. 创建验证器实现类
```   java
   package com.example.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.Method;

public class EnumValueValidator implements ConstraintValidator<EnumValue, Object> {

    private Class<? extends Enum<?>> enumClass;
    private String method;
    private boolean allowNull;
    
    @Override
    public void initialize(EnumValue constraintAnnotation) {
        this.enumClass = constraintAnnotation.enumClass();
        this.method = constraintAnnotation.method();
        this.allowNull = constraintAnnotation.allowNull();
    }
    
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        // 如果允许为空且值为空，返回true
        if (allowNull && value == null) {
            return true;
        }
        
        // 如果值不为空但枚举类为空，返回false
        if (enumClass == null) {
            return false;
        }
        
        // 值为空且不允许为空，返回false
        if (value == null) {
            return false;
        }
        
        // 获取枚举的所有实例
        Enum<?>[] enums = enumClass.getEnumConstants();
        if (enums == null) {
            return false;
        }
        
        try {
            // 获取指定的方法
            Method enumMethod = enumClass.getMethod(method);
            
            // 遍历枚举值进行匹配
            for (Enum<?> enumValue : enums) {
                Object enumFieldValue = enumMethod.invoke(enumValue);
                if (value.equals(enumFieldValue)) {
                    return true;
                }
            }
        } catch (Exception e) {
            // 处理异常
            return false;
        }
        
        return false;
    }
}
```
## 3. 创建示例枚举
```   java
   package com.example.enums;

public enum OrderStatus {
PENDING("待处理"),
PROCESSING("处理中"),
COMPLETED("已完成"),
CANCELLED("已取消");

    private String description;
    
    OrderStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    // 用于校验的方法
    public String getCode() {
        return this.name();
    }
}
java
package com.example.enums;

public enum UserType {
ADMIN("管理员"),
USER("普通用户"),
GUEST("访客");

    private String description;
    
    UserType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
```
## 4. 使用示例
###   4.1 在实体类中使用
```   java
   package com.example.entity;

import com.example.enums.OrderStatus;
import com.example.enums.UserType;
import com.example.validation.EnumValue;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class Order {

    @NotBlank(message = "订单号不能为空")
    private String orderNo;
    
    // 使用枚举的 name() 方法进行校验（默认）
    @EnumValue(enumClass = OrderStatus.class, message = "订单状态不正确")
    private String status;
    
    // 使用枚举的自定义方法进行校验
    @EnumValue(enumClass = UserType.class, method = "name", message = "用户类型不正确")
    private String userType;
    
    // 允许为空的枚举校验
    @EnumValue(enumClass = OrderStatus.class, allowNull = true, message = "订单状态不正确")
    private String optionalStatus;
}
```
### 4.2 在 Controller 中使用
``` java
package com.example.controller;

import com.example.entity.Order;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Validated
public class OrderController {

    @PostMapping("/create")
    public String createOrder(@Valid @RequestBody Order order) {
        // 如果校验失败，会抛出 MethodArgumentNotValidException
        return "订单创建成功";
    }
    
    @GetMapping("/query")
    public String queryOrder(@RequestParam @EnumValue(enumClass = OrderStatus.class, message = "订单状态参数不正确") String status) {
        // 参数校验
        return "查询成功";
    }
}
```
## 5. 高级版本：支持多种数据类型
   如果你需要支持更多数据类型（如 Integer、Long 等），可以增强验证器：

```java
package com.example.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class EnhancedEnumValueValidator implements ConstraintValidator<EnumValue, Object> {

    private Set<String> validValues;
    private boolean allowNull;
    
    @Override
    public void initialize(EnumValue constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
        Class<? extends Enum<?>> enumClass = constraintAnnotation.enumClass();
        String method = constraintAnnotation.method();
        
        try {
            Method enumMethod = enumClass.getMethod(method);
            Enum<?>[] enums = enumClass.getEnumConstants();
            
            this.validValues = Arrays.stream(enums)
                    .map(e -> {
                        try {
                            return String.valueOf(enumMethod.invoke(e));
                        } catch (Exception ex) {
                            return null;
                        }
                    })
                    .filter(v -> v != null)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            this.validValues = Set.of();
        }
    }
    
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return allowNull;
        }
        
        return validValues.contains(String.valueOf(value));
    }
}
```
## 6. 全局异常处理
```   java
   package com.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
```
