
//BUDGET CONTROLLER
var budgetController = (function() {

	var Expenses = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	//calculates the percentage
	Expenses.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100); 
		}
		else {
			this.percentage = -1;
		}

	};
	//returns the percentage
	Expenses.prototype.getPercentage = function() {
		return this.percentage;
	};
	
	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}; 

	var calculateTotal = function(type){
		var sum = 0;
		//loop over the inc and exp arrays using forEach method to calculate the sum
		data.allItems[type].forEach(function(cur){
			sum += cur.value;

		});
		data.totals[type] = sum;
	};

//creating data structures and organizing all similar variables into one one place for better structure of code

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0 ,
		percentage: -1
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			//[1,2,3,4,5], next ID =6;
			//[1,2,4,6,8], next ID = 9;
			//logic: ID = lastID + 1;
			//Create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}
			else{
				ID = 0;
			}
			

			//Create new item based on 'inc' or 'exp'
			if(type === 'exp'){
				newItem = new Expenses(ID, des, val);
			}
			else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}
			//push into appropriate data structure
			data.allItems[type].push(newItem);

			//return the new element
			return newItem;
		},

		deleteItem: function(type, id) {
			var ids, index;
			
			//data.allItems[type][id];
			//ids = [1,2,4,6,8]
			//index = 3
			//we introduce the map method to loop over array
			//we will make a new array consisting of all the indexes that we have at current
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice(index, 1);

			}



		},

		calculateBudget: function() {

			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');


			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;


			//calculate the % of income that we spent
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

			}
			else{
				data.percentage = -1;
			}


		},

		calculatePercentages: function() {
			/*
			suppose we have three expenses in our expense array
			a=20
			b=10
			c=40
			total income=100
			% of each
			a=20/100=20%
			b=10/100=10%
			c=40/100=40%

			*/
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});

		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},


		testing: function(){
			console.log(data);
		}
	};

})();


//UI CONTROLLER
var UIController = (function() {
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'


	};

	var formatNumber = function(num, type) {
			var numSplit, int, dec;
			/*
			+ or - before number
			exactly 2 decimal points
			comma separating the thousands
			2310.4567 -> + 2,310.46
			2000 -> + 2000
			*/

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];

			if(int.length > 3) {  //if > 3, that means we have num greater than 1000 so we need to add comma.
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3); //input = 2310, output= 2,310

			}

			dec = numSplit[1];

			

			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
		};


	var nodeListForEach = function(list, callback) {
		for(var i = 0; i < list.length; i++) {
				callback(list[i], i);

		}
	};
	//all methods in this module could use this now, not any of them outside this module.


	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value),

			};	
		},

		addListItem: function(obj, type){
			var html, newHtml, element;
			//Create HTML string with placeholde text
			if(type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			
			}
			else if(type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			

			//Replace he placeholder text with some actual data
			//Since HTML is also a string, all string methods can be used with it.We use .replace method to replace our placeholder text with the actual data that we receive.

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


			//insert the HTML into the DOM.
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		clearFields: function(){
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
			
			fieldsArr = Array.prototype.slice.call(fields);//this is variable is set to fields.
			fieldsArr.forEach(function (current, index, array){
				current.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget: function(obj){
			var type;

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

			}
			else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '----';
			}
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, function(current, index) {
				if(percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				}
				else{
					current.textContent = '---';
				}


			});



		},

		displayMonth: function() {
			var now, year, month, months;

			now = new Date();

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;



		},

		changedType: function() {

			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' + DOMstrings.inputDescription 
				+ ',' + DOMstrings.inputValue);

			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');

			});

			document.querySelector(DOMstrings.inputButton).classList.toggle('red');

		},

		getDOMstrings: function() {
			return DOMstrings;
		}
		
	};

})();



//GLOBAL APP CONTROLLER
var  controller = (function(budgetCtrl, UICtrl) {
	var setupEventListeners = function(){
		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event){
		
			if(event.keyCode === 13 || event.which === 13){
		
				ctrlAddItem();
		//We will write a custom function all these and call it at both places.
			}

		});
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

	};
	//making separate function for this instead of just keeping it in the ctrlAddItem function in order to maintain DRY principle because we will have to repeat the same code also after dleting the item.
	var updateBudget = function(){
		//1.Calculate the budget
		budgetCtrl.calculateBudget();

		//2. return the budget

		var budget = budgetCtrl.getBudget();

		
		//3. Display the budget on the UI
		UICtrl.displayBudget(budget);
		//console.log(budget);
	
	}; //we will then call this function in ctrlAddItem method.

	var updatePercentages = function() {

		//1. Calculate the percentages
		budgetCtrl.calculatePercentages();

		//2. Read them from the budgetController
		var percentages = budgetCtrl.getPercentages();

		//3. update the user Interface with the new percentages.
		UICtrl.displayPercentages(percentages);
	};

	var ctrlAddItem = function(){
		var input, newItem
		//1. Get the field input data
		input = UICtrl.getInput();

		//We will add a condition here that all of this should only happen if actually there is some data in the input fields and this avoid by adding empty lines when the button is clicked.

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){
			//2. Add the item to the budget Controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		//3. Add the item to the UI
		UICtrl.addListItem(newItem, input.type);

		//4.For clearing the Input fields.
		UICtrl.clearFields();
		
		//5.Calculate and display the budget
		updateBudget();

		//6. calculate and update the percentages
		updatePercentages();

		}
		
	};

	var ctrlDeleteItem = function() {
		var itemId, splitId, type, ID;
		itemId = (event.target.parentNode.parentNode.parentNode.parentNode.id);
		if(itemId){
			//inc-1 or exp-1
			splitId = itemId.split('-');
			type = splitId[0]; //above line returns an array and its first element will be eithe inc or exp;
			ID = parseInt(splitId[1]);

			//1. Delete item from data structure
			budgetCtrl.deleteItem(type, ID);

			//2.Delete item from UI
			UICtrl.deleteListItem(itemId);

			//3. Update and show new Budget
			updateBudget();

			//4. Calculate and update the percentages
			updatePercentages();
		}
	};
	
	return {
		init: function(){
			console.log('Application has Started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({budget: 0,
				totalInc: 0,

				totalExp: 0,
				percentage: -1
				}); //we dont pass budget here because we want everything to be zero when we reload the application. So we need to pass an object similar to the budget object but with everything set to zero.
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();





