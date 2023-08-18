#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char **GetManifest(int *outSize)
{
    FILE *fptr = fopen("blog/manifest.txt", "r");

    int size;
    fscanf(fptr, "%i", &size);
    char **names = malloc(sizeof(void *) * size);

    for (int i = 0; i < size; i++)
    {
        int cur = 0;
        char *buffer = malloc(sizeof(char));
        int newLinesEncountered = 0;
        char curChar;

        do
        {
            curChar = fgetc(fptr);

            if (curChar == '\n')
            {

                if (cur > 0)
                    newLinesEncountered++;

                if (newLinesEncountered == 1)
                    buffer[cur] = '\0';
            }
            else if (newLinesEncountered == 0)
            {
                buffer[cur] = curChar;
                cur++;
                buffer = realloc(buffer, sizeof(char) * (cur + 1));
            }
        } while (newLinesEncountered < 3 && curChar != EOF);

        names[i] = buffer;
    }
    fclose(fptr);

    *outSize = size;
    return names;
}

void GetHtmlTemplate(char **out1, char **out2, char **out3, char **out4, char **out5, char **out6)
{
    FILE *fptr = fopen("blog/blogtemplate.html", "r");

    int divNum = 5;
    char divs[5][20];
    strcpy(divs[0], "<!--TITLE-->");
    strcpy(divs[1], "<!--DESC-->");
    strcpy(divs[2], "<!--BTITLE-->");
    strcpy(divs[3], "<!--SUB-->");
    strcpy(divs[4], "<!--CONTENT-->");

    int cur = 0;
    char **ins = malloc(sizeof(void *) * (divNum + 1));
    for (int i = 0; i < divNum + 1; i++)
    {
        ins[i] = malloc(sizeof(char));
    }

    int position = 0;
    int checkProgress = 0;

    char curChar;
    do
    {
        curChar = fgetc(fptr);

        ins[position][cur] = curChar;
        cur++;
        ins[position] = realloc(ins[position], sizeof(char) * (cur + 1));

        if (position < divNum)
        {
            if (curChar == divs[position][checkProgress])
                checkProgress++;
            else
                checkProgress = 0;

            if (checkProgress == strlen(divs[position]))
            {
                ins[position][cur - checkProgress] = '\0';
                position++;
                cur = 0;
                checkProgress = 0;
            }
        }

    } while (curChar != EOF);

    ins[position][cur - 1] = '\0';
    fclose(fptr);

    *out1 = ins[0];
    *out2 = ins[1];
    *out3 = ins[2];
    *out4 = ins[3];
    *out5 = ins[4];
    *out6 = ins[5];

    free(ins);
}

char **GetFileData(char dir[], int *outlineCount)
{
    FILE *fptr = fopen(dir, "r");

    if (fptr != NULL)
    {
        int linecount = 0;
        int cur = 0;
        char **lines = malloc(sizeof(void *));
        lines[linecount] = malloc(sizeof(char));
        char *debugBuffer;
        char curChar;

        do
        {
            curChar = fgetc(fptr);

            if (curChar == '\n')
            {
                if (cur > 0)
                {
                    lines[linecount][cur] = '\0';
                    linecount++;
                    lines = realloc(lines, sizeof(void *) * (linecount + 2));
                    lines[linecount] = malloc(sizeof(char));
                    cur = 0;
                }
            }
            else
            {
                lines[linecount][cur] = curChar;
                cur++;
                lines[linecount] = realloc(lines[linecount], sizeof(char) * (cur + 2));
            }

            debugBuffer = lines[linecount];
        } while (curChar != EOF);

        *outlineCount = linecount;

        return lines;
    }
    else
        return NULL;
}

int main()
{
    int size;
    char **names = GetManifest(&size);

    char *beforeTitle;
    char *beforeDesc;
    char *beforeBTitle;
    char *beforeBSTitle;
    char *beforeContent;
    char *after;

    GetHtmlTemplate(&beforeTitle, &beforeDesc, &beforeBTitle, &beforeBSTitle, &beforeContent, &after);

    for (int i = 0; i < size; i++)
    {
        char sourceDir[100] = "blog/data/";
        strcat(sourceDir, names[i]);
        strcat(sourceDir, "/blog.txt");

        int linecount;
        char **blogbody = GetFileData(sourceDir, &linecount);

        char dir[100] = "blog/pages/";
        strcat(dir, names[i]);
        strcat(dir, ".html");

        FILE *fptr = fopen(dir, "w");


        if (blogbody != NULL)
        {
            fprintf(fptr, beforeTitle);
            fprintf(fptr, blogbody[0]);
            fprintf(fptr, beforeDesc);
            fprintf(fptr, blogbody[1]);
            fprintf(fptr, beforeBTitle);
            fprintf(fptr, blogbody[0]);
            fprintf(fptr, beforeBSTitle);
            fprintf(fptr, blogbody[2]);
            fprintf(fptr, beforeContent);

            for (int l = 3; l < linecount; l++)
            {
                fprintf(fptr, "<p>");
                fprintf(fptr, blogbody[l]);
                fprintf(fptr, "</p>\n");
            }

            fprintf(fptr, after);
        }

        fclose(fptr);

        printf("\"%s\" : %s\n", names[i], blogbody == NULL ? "[NULL blog]" : "");
        free(names[i]);

        if (blogbody != NULL)
            free(blogbody);
    }

    free(after);
    free(names);
}