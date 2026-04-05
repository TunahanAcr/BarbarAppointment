//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
void main() {
    Scanner input = new Scanner(System.in);
    String myInput = input.nextLine();

    String[] split = myInput.trim().split("\\s+");
    System.out.println(split.length);
}
