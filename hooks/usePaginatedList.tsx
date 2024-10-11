import { useEffect, useState, useRef } from 'react';
import { FlatList } from 'react-native';

type FetchDataFunction<T> = ((page: number) => Promise<{ data: T[]; numberPage: number }>) | 
                            ((id: number , page: number) => Promise<{ data: T[]; numberPage: number }>);

export const usePaginatedList = <T,>(
    fetchData: FetchDataFunction<T>,
    initialPage: number = 1,
    id?: number
) => {
    const [dataList, setDataList] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(10);
    const [page, setPage] = useState<number>(initialPage);
    const flatListRef = useRef<FlatList>(null);

    const fetchDataForPage = async (pageNum: number) => {
        try {
            setIsLoading(true);
            let res;
            if (id !== undefined && fetchData.length === 2) {
                res = await (fetchData as (page: number, id: number) => Promise<{ data: T[]; numberPage: number }>)(pageNum, id);
            } else {
                res = await (fetchData as (page: number) => Promise<{ data: T[]; numberPage: number }>)(pageNum);
            }
            setDataList(res.data);
            setTotalPage(Math.ceil(res.numberPage));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataForPage(page);
    }, [page, id]);

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
    };

    const handlePageChange = (pageNum: number) => {
        setPage(pageNum);
        scrollToTop();
    };

    const getVisiblePages = (): Array<number> => {
        const pages: Array<number> = [];
        const maxVisiblePages = 3;

        if (totalPage <= maxVisiblePages) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else if (page === 1) {
            pages.push(1, 2, 3);
        } else if (page === totalPage) {
            pages.push(totalPage - 2, totalPage - 1, totalPage);
        } else {
            pages.push(page - 1, page, page + 1);
        }

        return pages;
    };

    return {
        dataList,
        setDataList,
        isLoading,
        totalPage,
        page,
        flatListRef,
        handlePageChange,
        getVisiblePages,
    };
};