#include <stdio.h>
#include <string.h>

void marker(char *line, int len, int unique_len);

int main(void) {
  FILE *f = fopen("6.input", "r");
  if (f == NULL) {
    printf("Error opening file\n");
    return 1;
  }

  char line[100000];

  while (fgets(line, sizeof(line), f) != NULL) {
    int len = strlen(line);

    marker(line, len, 4);
    marker(line, len, 14);
  }

  fclose(f);
  return 0;
}

void marker(char *line, int len, int unique_len) {
  for (int i = 0; line[i] != '\0'; i++) {
    if (i + unique_len + 1 > len) // out of bounds
      break;

    int seen[256] = {0};
    int unique = 1;

    for (int j = i; j < i + unique_len; j++) {
      if (seen[line[j]] == 1) {
        unique = 0;
        break;
      }
      seen[line[j]] = 1;
    }

    if (unique) {
      char substr[unique_len + 1];
      strncpy(substr, &line[i], unique_len);
      substr[unique_len] = '\0';

      printf("found: %.*s\n", unique_len, &line[i]);
      printf("%d\n", i + unique_len);
      break;
    }
  }
}
