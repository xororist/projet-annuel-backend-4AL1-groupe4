const readline = require('readline');

class Contact {
    constructor(name, phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    toString() {
        return `Name: ${this.name}, Phone Number: ${this.phoneNumber}`;
    }
}

class ContactManager {
    constructor() {
        this.contacts = [];
    }

    addContact(contact) {
        this.contacts.push(contact);
        console.log(`Contact added: ${contact}`);
    }

    displayContacts() {
        if (this.contacts.length === 0) {
            console.log('No contacts to display.');
        } else {
            console.log('Contacts:');
            this.contacts.forEach(contact => console.log(contact.toString()));
        }
    }

    searchContact(name) {
        const foundContacts = this.contacts.filter(contact => contact.name.toLowerCase() === name.toLowerCase());
        if (foundContacts.length === 0) {
            console.log(`No contact found with the name: ${name}`);
        } else {
            foundContacts.forEach(contact => console.log(`Contact found: ${contact}`));
        }
    }
}

const contactManager = new ContactManager();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\nContact Manager');
    console.log('1. Add Contact');
    console.log('2. Display Contacts');
    console.log('3. Search Contact');
    console.log('4. Exit');
    rl.question('Enter your choice: ', handleMenu);
}

function handleMenu(choice) {
    switch (choice) {
        case '1':
            rl.question('Enter name: ', name => {
                rl.question('Enter phone number: ', phoneNumber => {
                    const newContact = new Contact(name, phoneNumber);
                    contactManager.addContact(newContact);
                    showMenu();
                });
            });
            break;
        case '2':
            contactManager.displayContacts();
            showMenu();
            break;
        case '3':
            rl.question('Enter name to search: ', name => {
                contactManager.searchContact(name);
                showMenu();
            });
            break;
        case '4':
            console.log('Exiting Contact Manager.');
            rl.close();
            break;
        default:
            console.log('Invalid choice. Please try again.');
            showMenu();
            break;
    }
}

showMenu();
