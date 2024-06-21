class Contact:
    def __init__(self, name, phone_number):
        self.name = name
        self.phone_number = phone_number

    def __str__(self):
        return f"Name: {self.name}, Phone Number: {self.phone_number}"


class ContactManager:
    def __init__(self):
        self.contacts = []

    def add_contact(self, contact):
        self.contacts.append(contact)
        print(f"Contact added: {contact}")

    def display_contacts(self):
        if not self.contacts:
            print("No contacts to display.")
        else:
            print("Contacts:")
            for contact in self.contacts:
                print(contact)

    def search_contact(self, name):
        found = False
        for contact in self.contacts:
            if contact.name.lower() == name.lower():
                print(f"Contact found: {contact}")
                found = True
        if not found:
            print(f"No contact found with the name: {name}")


def main():
    contact_manager = ContactManager()
    while True:
        print("\nContact Manager")
        print("1. Add Contact")
        print("2. Display Contacts")
        print("3. Search Contact")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            name = input("Enter name: ")
            phone_number = input("Enter phone number: ")
            new_contact = Contact(name, phone_number)
            contact_manager.add_contact(new_contact)
        elif choice == '2':
            contact_manager.display_contacts()
        elif choice == '3':
            name = input("Enter name to search: ")
            contact_manager.search_contact(name)
        elif choice == '4':
            print("Exiting Contact Manager.")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
