var express = require('express');
var app = express();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




// Budget Controller
var budgetController = (function(){


    // Expense 오브젝트(id, description, value 메소드를 갖는)와 data오브젝트로 나누어 정의하는 이유는 data오브젝트에는 배열 메소드를 갖게하기 위해서이다. (합칠 수는 없나?)
    // 결과적으로 세부 메소드들을 갖는 소규모 오브젝트와 소규모 오브젝트로 이루어진 배열 메소드를 갖는 대형 오브젝트로 구성.
    // 이걸 이해할 수 있어 기쁘다!
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };


    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;

    }



    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0 
        },
        budget: 0,
        percentage: -1

    };

    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            }else{
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else{
                newItem = new Income(ID,des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);
            return newItem;

        },

        deleteItem: function(type, id){
            var index, ids;

            // id = 6
            // data.allItems[type][id]
            // [1,2,4,6,8]
            // index = 3


            // map method is for mapping for each array
            ids = data.allItems[type].map(function(current){
                return current.id;

            });
            console.log(ids);
            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent

            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
            }else{
                data.percentage = -1;
            }
            
        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
              
        },

        testing: function(){
            console.log(data);
        }
    };
  
})();


// UI Controller
var UIController = (function(){
    var DOMstrings = {
        // in order to use these methods when I want to modify class names
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        var numSplit, dec, type, intFront, intTotal;
        var int = [];
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
            
        }
    

        /* 숫자가 무한정 많아지면 콤마 처리 어떻게 할 것인지?
        for(var i = 0; i < int.length ; i++){

            intFront = int.substr(0, int.length-3);
            intTotal = intFront + ',' + int.substr(int.length-3, 3); //input 23510, output 23,510
            int = intFront;
            if(int.substr(0, int.length-3))
            
        };
        */
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };    


    return {
        // Value return
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            // Creat HTML string with placeholder text
            
            if (type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";

            });
            fieldsArr[0].focus();

        },

        displayBudget: function(obj){

            var type;
            obj.budget > 0 ? type= 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            

        //current 는 fields의 현재값을 의미(문맥상) 왜냐하면 위 nodeListForEach정의에 따름.
        nodeListForEach(fields, function(current, index){
            if(percentages[index] > 0){
                current.textContent = percentages[index] + '%';
            }else{
                current.textContent = '---';
            }
            });

        },

        displayMonth: function(){
            var now, month, months, year;

            now = new Date();
            //var christmas = new Date(2020, 12, 25);
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },


        // for using the DOMstrings in other Module.
        getDOMstrings: function(){

            return DOMstrings;
        }    
        
    };
    

})();


// Global APP controller
var controller = (function(budgetCtrl, UICtrl){

    // Click or Enter make the datas to be sent to budgetController(at this time, to Function Variable ctrlAddItem )
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings(); 
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
    
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    }
    
    var ctrlAddItem = function(){
        var input, newItem;
        // 1. Get the filed input data
        input = UICtrl.getInput();

         
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and Update Percentages
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID;


        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);

        if (itemID){

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];

            //그냥 두면 String이니(왜냐하면 SplitID가 string이니) 꼭 Number로 변환해야한다.
            ID = parseInt(splitID[1]);


            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and Show the new budget
            updateBudget();

            // 4. Calculate and Update Percentages
            updatePercentages();
        }

    }

    return {
        init: function(){
            console.log('Application has started.');
            
            setupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetController,UIController);

controller.init();