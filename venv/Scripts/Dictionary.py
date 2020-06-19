import nltk
#nltk.download()
from nltk.corpus import words


def Print_all_words():
    word_list = words.words()
    i = 0
    for word in word_list:
        i += 1
        print(word)
    print("total number of words is :", i);


def search_a_word(searched_word):
    word_list = words.words()
    for word in word_list:
        if word==searched_word:
            return True

    return False

def Print_all_words_start_from_same_letter(letter):
    word_list = words.words()
    i = 0
    for word in word_list:
        if word[0]==letter:
            i += 1
            print(word)
    print("total number of words printed is :", i);

def find_if_anagram(word1,word2):
    arr1=[0]*26
    arr2=[0]*26
    word1=word1.upper()
    word2=word2.upper()
    i=0
    while i<len(word1):
        arr1[ord(word1[i])-65]=arr1[ord(word1[i])-65]+1
        i+=1
    i=0
    while i<len(word2):
        arr2[ord(word2[i])-65]=arr2[ord(word2[i])-65]+1
        i+=1
    for i in range(0,26,1):
        if arr1[i]!=arr2[i]:
            return False

    return True


def find_all_anagrams(word):
    arr=[0]*26
    word_list = words.words()
    i = 0
    for dict_word in word_list:
        if find_if_anagram(dict_word,word):
            print(dict_word)
            i+=1
    print("total anagrams found : ",i)


def find_if_correct_puzzle_solve(word1,word2):
    arr1=[0]*26
    arr2=[0]*26
    word1=word1.upper()
    word2=word2.upper()
    i=0
    while i<len(word1):
        arr1[ord(word1[i])-65]=arr1[ord(word1[i])-65]+1
        i=i+1
    i=0
    while i<len(word2):
        arr2[ord(word2[i])-65]=arr2[ord(word2[i])-65]+1
        i=i+1
    for i in range(0,26,1):
        if arr1[i]>arr2[i] :
            return False

    return True


def word_puzzle_solver():
    solution_set=set()
    given_letters=input("enter the letters")
    arr = [0] * 26
    word_list = words.words()
    i = 0
    for dict_word in word_list:
        if find_if_correct_puzzle_solve(dict_word, given_letters) and (len(dict_word)>1 or dict_word.lower()=="a" or dict_word.lower()=="i"):
            #print(dict_word)
            solution_set.add(dict_word.upper())
            i += 1
    solution_set=sorted(solution_set)
    for word in solution_set:
        print(word)
    print("total anagrams found : ", i)

    return solution_set
#find_all_anagrams("apple")
word_puzzle_solver()
#print(search_a_word("za"))
