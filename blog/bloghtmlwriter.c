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

            if (curChar == '\n' || curChar == EOF)
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
        } while (newLinesEncountered < 1 && curChar != EOF);

        names[i] = buffer;
    }
    fclose(fptr);

    *outSize = size;
    return names;
}

void GetHtmlTemplate(char dir[], int divNum, char divs[][20], char **outs)
{
    FILE *fptr = fopen(dir, "r");

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

    for (int i = 0; i < (divNum + 1); i++)
    {
        outs[i] = ins[i];
    }

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

    char blogtempdivs[5][20];
    strcpy(blogtempdivs[0], "<!--TITLE-->");
    strcpy(blogtempdivs[1], "<!--DESC-->");
    strcpy(blogtempdivs[2], "<!--BTITLE-->");
    strcpy(blogtempdivs[3], "<!--SUB-->");
    strcpy(blogtempdivs[4], "<!--CONTENT-->");
    char **blogtempsecs = malloc(sizeof(void *) * 6);
    GetHtmlTemplate("blog/blogtemplate.html", 5, blogtempdivs, blogtempsecs);

    char blogbuttondivs[3][20];
    strcpy(blogbuttondivs[0], "<!--LINK-->");
    strcpy(blogbuttondivs[1], "<!--TITLE-->");
    strcpy(blogbuttondivs[2], "<!--DESC-->");
    char **blogbuttonsecs = malloc(sizeof(void *) * 4);
    GetHtmlTemplate("blog/blogbuttontemplate.html", 3, blogbuttondivs, blogbuttonsecs);

    const char *sresultsDir = "blog/searchresults.html";
    fclose(fopen(sresultsDir, "w"));

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
            fprintf(fptr, blogtempsecs[0]);
            fprintf(fptr, blogbody[0]);
            fprintf(fptr, blogtempsecs[1]);
            fprintf(fptr, blogbody[1]);
            fprintf(fptr, blogtempsecs[2]);
            fprintf(fptr, blogbody[0]);
            fprintf(fptr, blogtempsecs[3]);
            fprintf(fptr, blogbody[3]);
            fprintf(fptr, blogtempsecs[4]);

            for (int l = 4; l < linecount; l++)
            {
                fprintf(fptr, "<p>");
                fprintf(fptr, blogbody[l]);
                fprintf(fptr, "</p>\n");
            }

            fprintf(fptr, blogtempsecs[5]);

            FILE *sResults = fopen(sresultsDir, "a");

            fprintf(sResults, blogbuttonsecs[0]);
            fprintf(sResults, blogbody[2]);
            fprintf(sResults, blogbuttonsecs[1]);
            fprintf(sResults, blogbody[0]);
            fprintf(sResults, blogbuttonsecs[2]);
            fprintf(sResults, blogbody[1]);
            fprintf(sResults, blogbuttonsecs[3]);

            fclose(sResults);
        }

        fclose(fptr);

        printf("\"%s\" : %s\n", names[i], blogbody == NULL ? "[NULL blog]" : "");
        free(names[i]);

        if (blogbody != NULL)
            free(blogbody);
    }

    for (int i = 0; i < 6; i++)
    {
        free(blogtempsecs[i]);
    }
    
    free(names);
}